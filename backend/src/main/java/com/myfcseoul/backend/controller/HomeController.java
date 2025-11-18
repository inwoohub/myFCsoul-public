package com.myfcseoul.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        // src/main/resources/templates 폴더에 home.html 파일이 있어야 합니다.
        // View Resolver가 home.html을 찾아 렌더링 합니다.
        return "home";
    }
}
