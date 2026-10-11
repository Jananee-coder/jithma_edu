package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


import lk.jithma_edu.dao.GuardianStatusDao;
import lk.jithma_edu.entity.GuardianStatus;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class GuardianStatusController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka guardianStatusDao instance ekak create karala me variable ekata
    // inject karanawa.
    private GuardianStatusDao guardianStatusDao;

     @GetMapping(value = "/guardianstatus/alldata", produces = "application/json")
    public List<GuardianStatus> getAllData() {

        // me method eka /guardianstatus/alldata kiyala url eken call karama
        // database eke thiyena okkoma GuardianStatus data return karanawa JSON format ekata.

        return guardianStatusDao.findAll(); // DB eken okkoma records gannawa
    }
}
