package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.GuardianTypeDao;
import lk.jithma_edu.entity.GuardianType;


@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class GuardianaTypeController {
     @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka GuardianTypeDao instance ekak create karala me variable ekata inject karanawa.
    private GuardianTypeDao guardianTypeDao;

    @GetMapping(value = "/guardiantype/alldata", produces = "application/json")
    public List<GuardianType> getAllData() {

        // me method eka /guardiantype/alldata kiyala url eken call karama
        // database eke thiyena okkoma GuardianType data return karanawa JSON format ekata.

        return guardianTypeDao.findAll(); // DB eken okkoma records gannawa
    }
}
