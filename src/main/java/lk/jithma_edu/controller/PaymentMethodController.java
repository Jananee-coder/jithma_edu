package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.PaymentMethodDao;
import lk.jithma_edu.entity.PaymentMethod;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class PaymentMethodController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka PaymentMethodDao instance ekak create karala me variable
    // ekata inject karanawa.

    private PaymentMethodDao paymentMethodDao;

    @GetMapping(value = "/paymentmethod/alldata", produces = "application/json")
    public List<PaymentMethod> getAllData() {

        // me method eka /paymentmethod/alldata kiyala url eken call karama
        // database eke thiyena okkoma PaymentMethod data return karanawa JSON format
        // ekata.

        return paymentMethodDao.findAll(); // DB eken okkoma records gannawa
    }
}
