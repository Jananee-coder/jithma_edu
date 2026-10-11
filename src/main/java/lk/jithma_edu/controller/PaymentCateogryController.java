package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.PaymentCategoryDao;
import lk.jithma_edu.entity.PaymentCategory;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class PaymentCateogryController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka PaymentCategoryDao instance ekak create karala me variable ekata inject karanawa.

    private PaymentCategoryDao paymentCategoryDao;

    @GetMapping(value = "/paymentcategory/alldata", produces = "application/json")
    public List<PaymentCategory> getAllData() {

        // me method eka /paymentcategory/alldata kiyala url eken call karama
        // database eke thiyena okkoma PaymentCategory data return karanawa JSON format ekata.

        return paymentCategoryDao.findAll(); // DB eken okkoma records gannawa
    }
}
