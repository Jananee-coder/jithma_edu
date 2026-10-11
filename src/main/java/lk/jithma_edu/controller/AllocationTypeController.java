package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.AllocationTypeDao;
import lk.jithma_edu.entity.AllocationType;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class AllocationTypeController {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka allocationTypeDao instance ekak create karala me variable ekata inject karanawa.
    private AllocationTypeDao allocationTypeDao;

    @GetMapping(value = "/allocationtype/alldata", produces = "application/json")
    public List<AllocationType> getAllData() {

        // me method eka /allocationtype/alldata kiyala url eken call karama
        // database eke thiyena okkoma AllocationType data return karanawa JSON format ekata.

        return allocationTypeDao.findAll(); // DB eken okkoma records gannawa
    }
}