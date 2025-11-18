//package com.myfcseoul.backend.service;
//
//import com.myfcseoul.backend.model.MyData;
//import com.myfcseoul.backend.repository.MyDataRepository;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//@Service
//public class MyDataService {
//    private final MyDataRepository myDataRepository;
//
//    public MyDataService(MyDataRepository myDataRepository) {
//        this.myDataRepository = myDataRepository;
//    }
//
//    /**
//     * 주어진 userId에 대해 attended=1인 MyData 목록을 DB에서 직접 조회합니다.
//     */
//    @Transactional(readOnly = true)
//    public List<MyData> getByUserId(String userId) {
//        return myDataRepository.findAllByUserUserIdAndAttended(userId, 1);
//    }
//}


package com.myfcseoul.backend.service;

import com.myfcseoul.backend.model.MyData;
import com.myfcseoul.backend.repository.MyDataRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MyDataService {
    private final MyDataRepository myDataRepository;

    public MyDataService(MyDataRepository myDataRepository) {
        this.myDataRepository = myDataRepository;
    }

    /**
     * 주어진 userId에 대해 approved(출석=1) MyData 목록을 DB에서 직접 조회합니다.
     */
    @Transactional(readOnly = true)
    public List<MyData> getByUserId(String userId) {
        return myDataRepository.findByUserUserIdAndAttended(userId, 1);
    }
}
