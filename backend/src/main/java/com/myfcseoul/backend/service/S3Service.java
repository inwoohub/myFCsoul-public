//package com.myfcseoul.backend.service;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import software.amazon.awssdk.services.s3.presigner.S3Presigner;
//import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
//import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
//import software.amazon.awssdk.services.s3.model.PutObjectRequest;
//import software.amazon.awssdk.services.s3.model.GetObjectRequest;
//import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
//import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
//
//import java.time.Duration;
//
//@Service
//public class S3Service {
//    @Value("${app.aws.s3.bucket}")
//    private String bucketName;
//
//    private final S3Presigner presigner;
//
//    public S3Service(S3Presigner presigner) {
//        this.presigner = presigner;
//    }
//
//    // 1) 업로드용 Presigned PUT URL 발급
//    public PresignedPutObjectRequest generateUploadUrl(String key) {
//        PutObjectRequest objectRequest = PutObjectRequest.builder()
//                .bucket(bucketName)
//                .key(key)
//                .build();
//
//        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
//                .signatureDuration(Duration.ofMinutes(10))  // 10분 유효
//                .putObjectRequest(objectRequest)
//                .build();
//
//        return presigner.presignPutObject(presignRequest);
//    }
//
//    // 2) 다운로드용 Presigned GET URL 발급
//    public PresignedGetObjectRequest generateDownloadUrl(String key) {
//        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
//                .bucket(bucketName)
//                .key(key)
//                .build();
//
//        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
//                .signatureDuration(Duration.ofMinutes(60))  // 1시간 유효
//                .getObjectRequest(getObjectRequest)
//                .build();
//
//        return presigner.presignGetObject(presignRequest);
//    }
//}
//



package com.myfcseoul.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.time.Duration;

@Service
public class S3Service {
    @Value("${app.aws.s3.bucket}")
    private String bucketName;

    private final S3Presigner presigner;

    public S3Service(S3Presigner presigner) {
        this.presigner = presigner;
    }

    // 1) 업로드용 Presigned PUT URL 발급
    public PresignedPutObjectRequest generateUploadUrl(String key) {
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))  // 10분 유효
                .putObjectRequest(objectRequest)
                .build();

        return presigner.presignPutObject(presignRequest);
    }

    // 2) 다운로드용 Presigned GET URL 발급
    public PresignedGetObjectRequest generateDownloadUrl(String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(60))  // 1시간 유효
                .getObjectRequest(getObjectRequest)
                .build();

        return presigner.presignGetObject(presignRequest);
    }
}

