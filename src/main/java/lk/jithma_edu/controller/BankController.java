package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.BankDao;
import lk.jithma_edu.entity.Bank;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class BankController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka bankDao instance ekak create karala me
    // variable ekata
    // inject karanawa.
    private BankDao bankDao;

    @GetMapping(value = "/bank/alldata", produces = "application/json")
    public List<Bank> getAllData() {

        // me method eka /bank/alldata kiyala url eken call karama
        // database eke thiyena okkoma Bank data return karanawa JSON
        // format ekata.

        return bankDao.findAll(); // DB eken okkoma records gannawa
    }
}
