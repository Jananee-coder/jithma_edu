package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.DesignationDao;
import lk.jithma_edu.entity.Designation;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class DesignationController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka designationDao instance ekak create karala me variable
    // ekata
    // inject karanawa.
    private DesignationDao designationDao;

    @GetMapping(value = "/designation/alldata", produces = "application/json")
    public List<Designation> getAllData() {

        // me method eka /designation/alldata kiyala url eken call karama
        // database eke thiyena okkoma Designation data return karanawa JSON format
        // ekata.

        return designationDao.findAll(); // DB eken okkoma records gannawa
    }

    // define api for insert designation
    @PostMapping(value = "/designation/insert")
    public String insert(@RequestBody Designation designation) {
        // frontend eken JSON widiyata ena designation object eka RequestBody haraha
        // laba gannawa

        try {

            // designation object eka database ekata save karanawa
            designationDao.save(designation);

            // save success nam "OK" kiyala return karanawa
            return "OK";

        } catch (Exception e) {

            // save karana awasthawedi error ekak awoth error message eka return karanawa
            return e.getMessage();
        }

    }

}
