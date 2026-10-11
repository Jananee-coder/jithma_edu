package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.HallStatusDao;
import lk.jithma_edu.entity.HallStatus;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class HallStatusController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka hallStatusDao instance ekak create karala me variable
    // ekata
    // inject karanawa.
    private HallStatusDao hallStatusDao;

    @GetMapping(value = "/hallstatus/alldata", produces = "application/json")
    public List<HallStatus> getAllData() {

        // me method eka /hallstatus/alldata kiyala url eken call karama
        // database eke thiyena okkoma HallStatus data return karanawa JSON format
        // ekata.

        return hallStatusDao.findAll(); // DB eken okkoma records gannawa
    }
}
