package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.FeaturesDao;
import lk.jithma_edu.entity.Features;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class FeaturesController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka featuresDao instance ekak create karala me variable
    // ekata
    // inject karanawa.
    private FeaturesDao featuresDao;

    @GetMapping(value = "/features/alldata", produces = "application/json")
    public List<Features> getAllData() {

        // me method eka /features/alldata kiyala url eken call karama
        // database eke thiyena okkoma Features data return karanawa JSON format
        // ekata.

        return featuresDao.findAll(); // DB eken okkoma records gannawa
    }

    @RequestMapping(value = "/feature/listbyhallwithoutselect/{hallid}", produces = "application/json")
    public List<Features> getAllDataWithoutHallByHall(@PathVariable("hallid") Integer hallid) {
        return featuresDao.listFeaturesWithoutHall(hallid);
    }

}
