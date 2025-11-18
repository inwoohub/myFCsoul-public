package com.myfcseoul.backend.config;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import com.myfcseoul.backend.service.CustomOAuth2AuthenticationSuccessHandler;
import com.myfcseoul.backend.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomOAuth2AuthenticationSuccessHandler successHandler;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService,
                          CustomOAuth2AuthenticationSuccessHandler successHandler) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.successHandler = successHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors().and().csrf().disable()
                .formLogin().disable()

                .authorizeHttpRequests(auth -> auth
                        // OAuth2 진입점
                        .requestMatchers(
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/api/rankings",      // 로그인 없이 허용
                                "/api/schedule",       // 로그인 없이 허용
                                "/ws-chat/**"
                        ).permitAll()
                        .requestMatchers("/api/admin/**").hasAuthority("admin")
                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )

                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("http://52.79.233.194/", true)
                        .failureUrl("http://52.79.233.194/login?error")
                        .userInfoEndpoint(u -> u.userService(customOAuth2UserService))
                        .successHandler(successHandler)
                )

                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                );

        return http.build();
    }
}
