package com.yupi.springbootinit.model.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * chartinfodb
 * @TableName chart
 */
@TableName(value ="chart")
@Data
public class Chart implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * chart name
     */
    private String name;

    /**
     * analyze target
     */
    private String goal;

    /**
     * raw chart data
     */
    private String chartData;

    /**
     * chart type
     */
    private String chartType;

    /**
     * generated data chart
     */
    private String genChart;

    /**
     * generated conclusion
     */
    private String genResult;

    /**
     * task status
     */
    private String status;

    /**
     * task execution info
     */
    private String execMessage;

    /**
     * userId
     */
    private Long userId;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 是否删除
     */
    @TableLogic
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}