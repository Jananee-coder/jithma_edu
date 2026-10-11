package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.RegTypeDao;
import lk.jithma_edu.entity.RegType;

@RestController // me class eka REST controller ekak
public class RegTypeController {

    @Autowired
    // Spring container eken RegTypeDao instance eka inject karanawa
    private RegTypeDao regTypeDao;

    @GetMapping(value = "/regtype/alldata", produces = "application/json")
    public List<RegType> getAllData() {

        // me method eka /regtype/alldata kiyala URL eken call karama
        // database eke thiyena okkoma RegType data JSON widihata return karanawa

        return regTypeDao.findAll(); // DB eken okkoma records gannawa
    }
}