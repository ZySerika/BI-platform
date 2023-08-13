package com.yupi.springbootinit.model.vo;

import lombok.Data;

/**
 * BI return type
 */
@Data
public class BiResponse {

    private String genChart;

    private String genResult;

    private Long chartId;
}
