package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.ClassDetailStatusDao;
import lk.jithma_edu.entity.ClassDetailStatus;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class ClassDtailStatusController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka classDetailStatusDao instance ekak create karala me
    // variable ekata
    // inject karanawa.
    private ClassDetailStatusDao classDetailStatusDao;

    @GetMapping(value = "/classdetailstatus/alldata", produces = "application/json")
    public List<ClassDetailStatus> getAllData() {

        // me method eka /classdetailstatus/alldata kiyala url eken call karama
        // database eke thiyena okkoma ClassDetailStatus data return karanawa JSON
        // format ekata.

        return classDetailStatusDao.findAll(); // DB eken okkoma records gannawa
    }
}
