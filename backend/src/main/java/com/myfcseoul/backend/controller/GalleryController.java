package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.dto.CreateGalleryRequestDTO;
import com.myfcseoul.backend.model.Gallery;
import com.myfcseoul.backend.model.Schedule;
import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.repository.GalleryRepository;
import com.myfcseoul.backend.repository.ScheduleRepository;
import com.myfcseoul.backend.repository.UserRepository;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final GalleryRepository galleryRepo;
    private final UserRepository userRepo;

    public GalleryController(GalleryRepository g, UserRepository u) {
        this.galleryRepo = g;
        this.userRepo = u;
    }

    // ✅ POST: 다이어리 생성
    @PostMapping
    public ResponseEntity<Gallery> create(@Valid @RequestBody CreateGalleryRequestDTO req) {
        User user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "존재하지 않는 사용자입니다"));


        Gallery g = new Gallery();
        g.setUser(user);
        g.setTitle(req.getTitle());
        g.setContent(req.getContent());
        g.setImageUrl(req.getImageUrl());
        g.setCreatedAt(req.getCreatedAt());

        Gallery saved = galleryRepo.save(g);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ✅ GET: 특정 사용자의 갤러리(일기) 목록 조회
    @GetMapping("/{userId}")
    public ResponseEntity<List<Gallery>> getByUserId(@PathVariable String userId) {
        List<Gallery> galleries = galleryRepo.findByUserUserId(userId);
        return ResponseEntity.ok(galleries);
    }

    // ✅ DELETE: 다이어리 삭제
    @DeleteMapping("/{galleryId}")
    public ResponseEntity<Void> delete(@PathVariable Long galleryId) {
        galleryRepo.deleteById(galleryId);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{galleryId}")
    public ResponseEntity<Gallery> update(
            @PathVariable Long galleryId,
            @Valid @RequestBody CreateGalleryRequestDTO req) {

        Gallery existing = galleryRepo.findById(galleryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 다이어리를 찾을 수 없습니다."));

        // 사용자 정보는 바꾸지 않고 기존 유지
        existing.setTitle(req.getTitle());
        existing.setContent(req.getContent());
        existing.setImageUrl(req.getImageUrl());
        existing.setCreatedAt(req.getCreatedAt());

        Gallery updated = galleryRepo.save(existing);
        return ResponseEntity.ok(updated);
    }


}
