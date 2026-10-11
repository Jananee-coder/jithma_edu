package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.GradeDao;
import lk.jithma_edu.entity.Grade;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class GradeController {
      @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka GradeDao instance ekak create karala me variable ekata
    // inject karanawa.
    private GradeDao gradeDao;

    @GetMapping(value = "/grade/alldata", produces = "application/json")
    public List<Grade> getAllData() {

        // me method eka /grade/alldata kiyala url eken call karama
        // database eke thiyena okkoma Grade data return karanawa JSON format
        // ekata.

        return gradeDao.findAll(); // DB eken okkoma records gannawa
    }
}
