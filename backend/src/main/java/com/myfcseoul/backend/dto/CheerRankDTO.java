package com.myfcseoul.backend.dto;

/**
 * CheerMessage 개수 집계를 위한 projection 인터페이스
 */
public interface CheerRankDTO {
    String getNickname();     // User.nickname
    Long   getMessageCount(); // COUNT(cm) 결과
}
