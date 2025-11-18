//package com.myfcseoul.backend.controller;
//
//import com.myfcseoul.backend.service.S3Service;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
//import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/s3")
//public class S3Controller {
//
//    private final S3Service s3Service;
//
//    public S3Controller(S3Service s3Service) {
//        this.s3Service = s3Service;
//    }
//
//    // ✅ [1] 다이어리 이미지 업로드용 Presigned PUT URL
//    @GetMapping("/upload-url")
//    public ResponseEntity<Map<String, String>> getPresignedUploadUrl(@RequestParam String filename) {
//        String key = "diary/" + UUID.randomUUID() + "_" + filename;
//        PresignedPutObjectRequest presignedRequest = s3Service.generateUploadUrl(key);
//
//        Map<String, String> response = new HashMap<>();
//        response.put("uploadUrl", presignedRequest.url().toString());
//        response.put("key", key); // DB 저장용
//        return ResponseEntity.ok(response);
//    }
//
//    // ✅ [2] 직관 사진 업로드용 Presigned PUT URL
//    @GetMapping("/upload-url/attendance")
//    public ResponseEntity<Map<String, String>> getAttendanceUploadUrl(@RequestParam String filename) {
//        String key = "attendance/" + UUID.randomUUID() + "_" + filename;
//        PresignedPutObjectRequest presignedRequest = s3Service.generateUploadUrl(key);
//
//        Map<String, String> response = new HashMap<>();
//        response.put("uploadUrl", presignedRequest.url().toString());
//        response.put("key", key);
//        return ResponseEntity.ok(response);
//    }
//
//    // ✅ [3] 이미지(다이어리/직관) 보기용 Presigned GET URL
//    @GetMapping("/download-url")
//    public ResponseEntity<Map<String, String>> getPresignedDownloadUrl(@RequestParam String key) {
//        PresignedGetObjectRequest presignedRequest = s3Service.generateDownloadUrl(key);
//
//        Map<String, String> response = new HashMap<>();
//        response.put("url", presignedRequest.url().toString());
//        return ResponseEntity.ok(response);
//    }
//}
//

package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.service.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/s3")
public class S3Controller {

    private final S3Service s3Service;

    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    // ✅ [1] 다이어리 이미지 업로드용 Presigned PUT URL
    @GetMapping("/upload-url")
    public ResponseEntity<Map<String, String>> getPresignedUploadUrl(@RequestParam String filename) {
        String key = "diary/" + UUID.randomUUID() + "_" + filename;
        PresignedPutObjectRequest presignedRequest = s3Service.generateUploadUrl(key);

        Map<String, String> response = new HashMap<>();
        response.put("uploadUrl", presignedRequest.url().toString());
        response.put("key", key); // DB 저장용
        return ResponseEntity.ok(response);
    }

    // ✅ [2] 직관 사진 업로드용 Presigned PUT URL (헤더 없이 사용)
    @GetMapping("/upload-url/attendance")
    public ResponseEntity<Map<String, String>> getAttendanceUploadUrl(@RequestParam String filename) {
        String key = "attendance/" + UUID.randomUUID() + "_" + filename;
        PresignedPutObjectRequest presignedRequest = s3Service.generateUploadUrl(key);

        Map<String, String> response = new HashMap<>();
        response.put("uploadUrl", presignedRequest.url().toString());
        response.put("key", key);
        return ResponseEntity.ok(response);
    }

    // ✅ [3] 이미지(다이어리/직관) 보기용 Presigned GET URL
    @GetMapping("/download-url")
    public ResponseEntity<Map<String, String>> getPresignedDownloadUrl(@RequestParam String key) {
        PresignedGetObjectRequest presignedRequest = s3Service.generateDownloadUrl(key);

        Map<String, String> response = new HashMap<>();
        response.put("url", presignedRequest.url().toString());
        return ResponseEntity.ok(response);
    }
}


