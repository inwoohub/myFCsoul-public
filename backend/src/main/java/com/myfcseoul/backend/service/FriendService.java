package com.myfcseoul.backend.service;

import com.myfcseoul.backend.dto.FriendDto;
import com.myfcseoul.backend.model.Friend;
import com.myfcseoul.backend.model.FriendId;
import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.repository.FriendRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;
import java.util.stream.Collectors;

@Service
@Transactional
public class FriendService {

    private final FriendRepository repo;
    private final UserService userSvc;

    public FriendService(FriendRepository repo, UserService userSvc) {
        this.repo = repo;
        this.userSvc = userSvc;
    }

    /** 친구 요청 보내기 (상대 PENDING 감지 시 즉시 수락) */
    public void sendRequest(String me, String you) {
        // 이미 요청 또는 친구 관계가 있는지 체크
        if (repo.existsByUserIdAndFriendId(me, you)) {
            throw new IllegalStateException("이미 요청 또는 친구 관계가 존재합니다.");
        }
        // 상대가 보낸 PENDING 요청 확인
        Friend incoming = repo.findByUserIdAndFriendIdAndStatus(you, me, "PENDING");
        if (incoming != null) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime incomingTime = incoming.getRequestedAt();
            // 이전 요청보다 내가 늦게 보냈다면, 새 요청을 수락으로 처리
            if (incomingTime.isBefore(now)) {
                // 이전 요청 레코드 삭제
                repo.delete(incoming);
                // 새 요청을 CREATED 상태로 바로 ACCEPTED
                Friend accepted = new Friend();
                accepted.setUserId(me);
                accepted.setFriendId(you);
                accepted.setRequestedAt(now);
                accepted.setStatus("ACCEPTED");
                accepted.setRespondedAt(now);
                repo.save(accepted);
            } else {
                // 이전 요청이 더 늦게 보내졌다면 기존 레코드를 ACCEPTED
                incoming.setStatus("ACCEPTED");
                incoming.setRespondedAt(now);
                repo.save(incoming);
            }
            return;
        }
        // 신규 PENDING 생성
        Friend f = new Friend();
        f.setUserId(me);
        f.setFriendId(you);
        repo.save(f);
    }

    /** 받은 요청 수락 */
    public void acceptRequest(String me, String you) {
        Friend incoming = repo.findByUserIdAndFriendIdAndStatus(you, me, "PENDING");
        if (incoming == null) {
            throw new IllegalStateException("수락할 요청이 없습니다.");
        }
        incoming.setStatus("ACCEPTED");
        incoming.setRespondedAt(LocalDateTime.now());
        repo.save(incoming);
        Friend reciprocal = new Friend();
        reciprocal.setUserId(me);
        reciprocal.setFriendId(you);
        reciprocal.setStatus("ACCEPTED");
        reciprocal.setRequestedAt(incoming.getRequestedAt());
        reciprocal.setRespondedAt(incoming.getRespondedAt());
        repo.save(reciprocal);
    }

    /** 받은 요청 거절 */
    public void rejectRequest(String me, String you) {
        Friend incoming = repo.findByUserIdAndFriendIdAndStatus(you, me, "PENDING");
        if (incoming == null) {
            throw new IllegalStateException("거절할 요청이 없습니다.");
        }
        incoming.setStatus("REJECTED");
        incoming.setRespondedAt(LocalDateTime.now());
        repo.save(incoming);
    }

    /** 친구 삭제 또는 요청 취소 */
    public void removeFriend(String me, String you) {
        repo.deleteById(new FriendId(me, you));
        repo.deleteById(new FriendId(you, me));
    }

    /** 전체 친구 목록 (userId 리스트) */
    public List<String> getFriends(String me) {
        return Stream.concat(
                        // 내가 보낸 ACCEPTED
                        repo.findByUserIdAndStatus(me, "ACCEPTED")
                                .stream()
                                .map(Friend::getFriendId),
                        // 나에게 온 ACCEPTED
                        repo.findByFriendIdAndStatus(me, "ACCEPTED")
                                .stream()
                                .map(Friend::getUserId)
                )
                // 중복된 userId는 한 번만 남김
                .distinct()
                .collect(Collectors.toList());
    }

    /** 받은 대기 요청 (userId 리스트) */
    public List<String> getPendingRequests(String me) {
        return repo.findByFriendIdAndStatus(me, "PENDING")
                .stream().map(Friend::getUserId).collect(Collectors.toList());
    }

    /** 보낸 대기 요청 (userId 리스트) */
    public List<String> getOutgoingPendingRequests(String me) {
        return repo.findByUserIdAndStatus(me, "PENDING")
                .stream().map(Friend::getFriendId).collect(Collectors.toList());
    }

    /** DTO 포함 친구 목록 */
    public List<FriendDto> getFriendsWithNickname(String me) {
        return getFriends(me).stream()
                .map(uid -> {
                    User u = userSvc.findById(uid)
                            .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없습니다."));
                    return new FriendDto(uid, u.getNickname());
                })
                .collect(Collectors.toList());
    }

    /** DTO 포함 받은 대기 요청 */
    public List<FriendDto> getPendingRequestsWithNickname(String me) {
        return getPendingRequests(me).stream()
                .map(uid -> {
                    User u = userSvc.findById(uid)
                            .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없습니다."));
                    return new FriendDto(uid, u.getNickname());
                })
                .collect(Collectors.toList());
    }

    /** DTO 포함 보낸 대기 요청 */
    public List<FriendDto> getOutgoingPendingRequestsWithNickname(String me) {
        return getOutgoingPendingRequests(me).stream()
                .map(uid -> {
                    User u = userSvc.findById(uid)
                            .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없습니다."));
                    return new FriendDto(uid, u.getNickname());
                })
                .collect(Collectors.toList());
    }
}
