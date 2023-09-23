package com.yupi.springbootinit.bizmq;

import ch.qos.logback.classic.Logger;
import com.rabbitmq.client.Channel;
import com.yupi.springbootinit.common.ErrorCode;
import com.yupi.springbootinit.constant.CommonConstant;
import com.yupi.springbootinit.exception.BusinessException;
import com.yupi.springbootinit.manager.AiManager;
import com.yupi.springbootinit.model.entity.Chart;
import com.yupi.springbootinit.service.ChartService;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.concurrent.*;


@Component
@Slf4j
public class BiConsumer {

    @Resource
    private AiManager aiManager;

    @Resource
    private ChartService chartService;


    // Select message queue to listen to and Ack config
    @SneakyThrows
    @RabbitListener(queues = {BiMqConstant.BI_QUEUE_NAME}, ackMode = "MANUAL")
    public void receiveMessage(String message, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag){
        try {
            if(StringUtils.isBlank(message)) {
                channel.basicNack(deliveryTag, false, false);
                throw new BusinessException(ErrorCode.SYSTEM_ERROR, "empty message");
            }
            long chartId = Long.parseLong(message);

            Chart chart = chartService.getById(chartId);
            if(chart==null){
                channel.basicNack(deliveryTag, false, false);
                throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "empty graph");
            }

            // edit chart to "running"
            Chart updateChart = new Chart();
            updateChart.setId(chart.getId());
            updateChart.setStatus("running");
            boolean b = chartService.updateById(updateChart);
            if (!b) {
                channel.basicNack(deliveryTag, false, false);
                handleChartUpdateError(chart.getId(), "chart update failed.");
                return;
            }
            Callable<String> chatTask = () -> aiManager.doChat(buildUserInput(chart));
            ExecutorService executor = Executors.newSingleThreadExecutor();
            Future<String> future = executor.submit(chatTask);
            String result = future.get(20, TimeUnit.SECONDS);
            String[] splits = result.split("~~");
            if (splits.length < 3) {
                channel.basicNack(deliveryTag, false, false);
                handleChartUpdateError(chart.getId(), "AI generation format error: please prompt again");
            }
            String genChart = splits[1].trim();
            String genResult = splits[2].trim();
            Chart updateChartResult = new Chart();
            updateChartResult.setId(chart.getId());
            updateChartResult.setGenChart(genChart);
            updateChartResult.setGenResult(genResult);
            updateChartResult.setStatus("succeed");
            boolean updateResult = chartService.updateById(updateChartResult);
            if (!updateResult) {
                channel.basicNack(deliveryTag, false, false);
                handleChartUpdateError(chart.getId(), "chart update failed.");
            }
        } catch (TimeoutException e){
            long chartId = Long.parseLong(message);

            channel.basicNack(deliveryTag, false, false);
            handleChartUpdateError(chartId, "Request timed out.");
        }

        channel.basicAck(deliveryTag, false);
    }

    /**
     * Build user input string
     * @param chart
     * @return
     */
    private String buildUserInput(Chart chart) {
        String goal = chart.getGoal();
        String chartType = chart.getChartType();
        String csvData = chart.getChartData();
        // construct user input
        StringBuilder userInput = new StringBuilder();
        userInput.append("GOAL: ").append("\\n");

        // concatenate objective
        String userGoal = goal;
        if (StringUtils.isNotBlank(chartType)) {
            userGoal += ", please use " + chartType;
        }
        userInput.append(userGoal).append("\\n");
        userInput.append("MYDATA: ").append("\\n");
        // compressed data
        userInput.append(csvData).append("\\n");
        return userInput.toString();
    }

    private void handleChartUpdateError(long chartId, String execMessage) {
        Chart updateChartResult = new Chart();
        updateChartResult.setId(chartId);
        updateChartResult.setStatus("failed");
        updateChartResult.setExecMessage(execMessage);
        boolean updateResult = chartService.updateById(updateChartResult);
        if(!updateResult) {
            log.error("chart update failed" + chartId + "," + execMessage);
        }
    }
}
