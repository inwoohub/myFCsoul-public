package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.model.MyData;
import com.myfcseoul.backend.repository.MyDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/mydata")
@PreAuthorize("hasAuthority('admin')")
public class AdminMyDataController {

    @Autowired
    private MyDataRepository myDataRepository;

    /**
     * 대기 중인 출석 요청 목록 조회 (attended = 0)
     */
    @GetMapping("/pending")
    public ResponseEntity<List<MyData>> getPendingList() {
        List<MyData> pendingList = myDataRepository.findByAttended(0);
        return ResponseEntity.ok(pendingList);
    }

    /**
     * 출석 요청 승인 (attended -> 1)
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<Map<String, String>> approve(@PathVariable Long id) {
        MyData data = myDataRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "MyData not found"));

        data.setAttended(1);
        myDataRepository.save(data);

        return ResponseEntity.ok(Collections.singletonMap("message", "승인되었습니다."));
    }

    /**
     * 출석 요청 거절 (attended -> 2)
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<Map<String, String>> reject(@PathVariable Long id) {
        MyData data = myDataRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "MyData not found"));

        data.setAttended(2);
        myDataRepository.save(data);

        return ResponseEntity.ok(Collections.singletonMap("message", "거절되었습니다."));
    }
}
