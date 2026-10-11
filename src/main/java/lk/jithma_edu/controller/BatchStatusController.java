package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.BatchStatusDao;
import lk.jithma_edu.entity.BatchStatus;



@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class BatchStatusController {
    
    
      @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka designationDao instance ekak create karala me variable ekata
    // inject karanawa.
    private BatchStatusDao batchStatusDao;

     @GetMapping(value = "/batchstatus/alldata", produces = "application/json")
    public List<BatchStatus> getAllData() {

        // me method eka /batchstatus/alldata kiyala url eken call karama
        // database eke thiyena okkoma BatchStatus data return karanawa JSON format ekata.

        return batchStatusDao.findAll(); // DB eken okkoma records gannawa
    }
}
