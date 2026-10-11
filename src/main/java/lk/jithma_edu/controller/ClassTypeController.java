package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.ClassTypeDao;
import lk.jithma_edu.entity.ClassType;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class ClassTypeController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka classTypeDao instance ekak create karala me variable
    // ekata
    // inject karanawa.
    private ClassTypeDao classTypeDao;

    @GetMapping(value = "/classtype/alldata", produces = "application/json")
    public List<ClassType> getAllData() {

        // me method eka /classtype/alldata kiyala url eken call karama
        // database eke thiyena okkoma ClassType data return karanawa JSON format ekata.

        return classTypeDao.findAll(); // DB eken okkoma records gannawa
    }
}