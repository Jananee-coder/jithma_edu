package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.PaymentModeDao;
import lk.jithma_edu.entity.PaymentMode;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class PaymentModeController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka PaymentModeDao instance ekak create karala me variable
    // ekata inject karanawa.

    private PaymentModeDao paymentModeDao;

    @GetMapping(value = "/paymentmode/alldata", produces = "application/json")
    public List<PaymentMode> getAllData() {

        // me method eka /paymentmode/alldata kiyala url eken call karama
        // database eke thiyena okkoma PaymentMode data return karanawa JSON format
        // ekata.

        return paymentModeDao.findAll(); // DB eken okkoma records gannawa
    }
}
