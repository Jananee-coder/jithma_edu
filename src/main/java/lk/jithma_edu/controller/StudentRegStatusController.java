package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import lk.jithma_edu.dao.StudentRegStatusDao;
import lk.jithma_edu.entity.StudentRegStatus;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class StudentRegStatusController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka instance ekak create karala me variable ekata inject
    // karanawa.

    private StudentRegStatusDao studentRegStatusDao;

    @GetMapping(value = "/studentregstatus/alldata", produces = "application/json")
    public List<StudentRegStatus> getAllData() {

        // me method eka /studentregstatus/alldata kiyala url eken call karama
        // database eke thiyena okkoma StudentRegStatus data return karanawa JSON format
        // ekata.

        return studentRegStatusDao.findAll(); // DB eken okkoma records gannawa
    }
}
