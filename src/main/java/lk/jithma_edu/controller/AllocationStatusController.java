package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.AllocationStatusDao;
import lk.jithma_edu.entity.AllocationStatus;


@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class AllocationStatusController {
   
      @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka allocationStatusDao instance ekak create karala me variable ekata inject karanawa.
    private AllocationStatusDao allocationStatusDao;

    @GetMapping(value = "/allocationstatus/alldata", produces = "application/json")
    public List<AllocationStatus> getAllData() {

        // me method eka /allocationstatus/alldata kiyala url eken call karama
        // database eke thiyena okkoma AllocationStatus data return karanawa JSON format ekata.

        return allocationStatusDao.findAll(); // DB eken okkoma records gannawa
    }
}
