package com.myfcseoul.backend.controller;

import com.myfcseoul.backend.dto.FriendDto;
import com.myfcseoul.backend.model.User;
import com.myfcseoul.backend.service.FriendService;
import com.myfcseoul.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    private final FriendService svc;
    private final UserService   userSvc;

    public FriendController(FriendService svc, UserService userSvc) {
        this.svc = svc;
        this.userSvc = userSvc;
    }

    /** 1-1) userId 기반 친구 요청 */
    @PostMapping("/{friendId}")
    public ResponseEntity<?> sendRequest(
            @PathVariable String friendId,
            Principal principal
    ) {
        svc.sendRequest(principal.getName(), friendId);
        return ResponseEntity.ok().build();
    }

    /** 1-2) 닉네임 기반 친구 요청 */
    @PostMapping  // /api/friends
    public ResponseEntity<?> sendRequestByNickname(
            @RequestBody Map<String, String> body,
            Principal principal
    ) {
        String nickname = body.get("nickname");
        User you = userSvc.findByNickname(nickname)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.")
                );
        svc.sendRequest(principal.getName(), you.getUserId());
        return ResponseEntity.ok().build();
    }

    /** 2) 받은 요청 수락 */
    @PutMapping("/{friendId}/accept")
    public ResponseEntity<?> acceptRequest(
            @PathVariable String friendId,
            Principal principal
    ) {
        svc.acceptRequest(principal.getName(), friendId);
        return ResponseEntity.ok().build();
    }

    /** 3) 받은 요청 거절 */
    @PutMapping("/{friendId}/reject")
    public ResponseEntity<?> rejectRequest(
            @PathVariable String friendId,
            Principal principal
    ) {
        svc.rejectRequest(principal.getName(), friendId);
        return ResponseEntity.ok().build();
    }

    /** 4) 친구 삭제 또는 요청 취소 */
    @DeleteMapping("/{friendId}")
    public ResponseEntity<?> removeFriend(
            @PathVariable String friendId,
            Principal principal
    ) {
        svc.removeFriend(principal.getName(), friendId);
        return ResponseEntity.noContent().build();
    }

    /** 5) 친구 목록 조회 (DTO 형태로 변경 필요) */
    @GetMapping
    public ResponseEntity<List<FriendDto>> listFriends(Principal principal) {
        List<FriendDto> friends = svc.getFriendsWithNickname(principal.getName());
        return ResponseEntity.ok(friends);
    }

    /** 6) 받은 대기 요청 목록 조회 */
    @GetMapping("/requests")
    public ResponseEntity<List<FriendDto>> listPending(Principal principal) {
        List<FriendDto> pendings = svc.getPendingRequestsWithNickname(principal.getName());
        return ResponseEntity.ok(pendings);
    }

    /** 7) 보낸 대기 요청 목록 조회 */
    @GetMapping("/requests/sent")
    public ResponseEntity<List<FriendDto>> listOutgoing(Principal p) {
        List<FriendDto> outgoings = svc.getOutgoingPendingRequestsWithNickname(p.getName());
        return ResponseEntity.ok(outgoings);
    }
}
