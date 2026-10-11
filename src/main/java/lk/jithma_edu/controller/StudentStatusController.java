package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.StudentStatusDao;
import lk.jithma_edu.entity.StudentStatus;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class StudentStatusController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka studentStatusDao instance ekak create karala me variable
    // ekata
    // inject karanawa.
    private StudentStatusDao studentStatusDao;

    @GetMapping(value = "/studentstatus/alldata", produces = "application/json")
    public List<StudentStatus> getAllData() {

        // me method eka /studentstatus/alldata kiyala url eken call karama
        // database eke thiyena okkoma StudentStatus data return karanawa JSON format
        // ekata.

        return studentStatusDao.findAll(); // DB eken okkoma records gannawa
    }
}
