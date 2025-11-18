package com.myfcseoul.backend.repository;

import com.myfcseoul.backend.model.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {

    // ✅ 유저 ID 기반으로 갤러리 목록 가져오기 (user.userId가 String인 경우)
    List<Gallery> findByUserUserId(String userId);
}
