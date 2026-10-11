package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.TeacherPayMethodDao;
import lk.jithma_edu.entity.TeacherPayMethod;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class TeacherPayMethodController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka teacherPayMethodDao instance ekak create karala me
    // variable ekata
    // inject karanawa.
    private TeacherPayMethodDao teacherPayMethodDao;

    @GetMapping(value = "/teacherpaymethod/alldata", produces = "application/json")
    public List<TeacherPayMethod> getAllData() {

        // me method eka /teacherpaymethod/alldata kiyala url eken call karama
        // database eke thiyena okkoma TeacherPayMethod data return karanawa JSON
        // format ekata.

        return teacherPayMethodDao.findAll(); // DB eken okkoma records gannawa
    }
}
