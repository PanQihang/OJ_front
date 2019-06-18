package com.oj.configuration;

import com.oj.security.OJHandleSecurity;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author lixu
 * @Time 2019年3月12日 13点47分
 * @Description 自定义拦截器OJHandleSecurity配置类
 */

@Configuration
public class OJHandleSecurityConfiguration implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        String[] excludes = new String[]{"/login/**", "/", "/css/**", "/js/**", "/fonts/**", "/error/**", "/static/**", "/index/**", "/vendor/**", "/upload/**"};
        registry.addInterceptor(new OJHandleSecurity()).addPathPatterns("/**").excludePathPatterns(excludes);
    }
}
