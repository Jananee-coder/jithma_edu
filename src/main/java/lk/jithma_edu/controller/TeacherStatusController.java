package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.TeacherStatusDao;
import lk.jithma_edu.entity.TeacherStatus;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class TeacherStatusController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka teacherStatusDao instance ekak create karala me
    // variable ekata
    // inject karanawa.
    private TeacherStatusDao teacherStatusDao;

    @GetMapping(value = "/teacherstatus/alldata", produces = "application/json")
    public List<TeacherStatus> getAllData() {

        // me method eka /teacherstatus/alldata kiyala url eken call karama
        // database eke thiyena okkoma TeacherStatus data return karanawa JSON
        // format ekata.

        return teacherStatusDao.findAll(); // DB eken okkoma records gannawa
    }
}
