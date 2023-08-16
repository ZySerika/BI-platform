package com.yupi.springbootinit.controller;

import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ThreadPoolExecutor;

@RestController
@RequestMapping("/queue")
@Slf4j
@Profile({"dev", "local"})
public class QueueController {

    @Resource
    private ThreadPoolExecutor threadPoolExecutor;

    @GetMapping("/add")
    public void add(String name){
        CompletableFuture.runAsync(() -> {
            log.info("executing: " + name + ", executor: " + Thread.currentThread().getName());
            try{
                Thread.sleep(600000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, threadPoolExecutor);
    }

    @GetMapping("/get")
    public String get(){
        Map<String, Object> map = new HashMap<>();
        int size = threadPoolExecutor.getQueue().size();
        map.put("queue size", size);
        long taskCount = threadPoolExecutor.getTaskCount();
        map.put("total task count", taskCount);
        long completedTaskCount = threadPoolExecutor.getCompletedTaskCount();
        map.put("completed task count", completedTaskCount);
        int activeCount = threadPoolExecutor.getActiveCount();
        map.put("active thread count", activeCount);
        return JSONUtil.toJsonStr(map);
    }
}
