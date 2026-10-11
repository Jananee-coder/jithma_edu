package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.EmployeeStatusDao;
import lk.jithma_edu.entity.EmployeeStatus;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class EmployeeStatusController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka employeeStatusDao instance ekak create karala me variable ekata
    // inject karanawa.
    private EmployeeStatusDao employeeStatusDao;

     @GetMapping(value = "/employeestatus/alldata", produces = "application/json")
    public List<EmployeeStatus> getAllData() {

        // me method eka /employeestatus/alldata kiyala url eken call karama
        // database eke thiyena okkoma EmployeeStatus data return karanawa JSON format ekata.

        return employeeStatusDao.findAll(); // DB eken okkoma records gannawa
    }
}
