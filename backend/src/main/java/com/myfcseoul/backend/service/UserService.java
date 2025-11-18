package com.myfcseoul.backend.service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepo;

    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    /** userId로 User 조회 */
    public Optional<User> findById(String userId) {
        return userRepo.findById(userId);
    }

    /** nickname으로 User 조회 */
    public Optional<User> findByNickname(String nickname) {
        return userRepo.findByNickname(nickname);
    }

    /** (NEW) 키워드 검색 + 페이지네이션 */
    public Page<User> searchUsers(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            return userRepo.findAll(pageable);
        }
        return userRepo.findByUserIdContainingIgnoreCaseOrNicknameContainingIgnoreCase(
                keyword, keyword, pageable
        );
    }

    /** (NEW) 총원 카운트 (선택) */
    public long countUsers(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return userRepo.count();
        }
        return userRepo.countByUserIdContainingIgnoreCaseOrNicknameContainingIgnoreCase(keyword, keyword);
    }
}
