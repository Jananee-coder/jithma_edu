package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.WeekdayDao;
import lk.jithma_edu.entity.Weekday;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class WeekdayController {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka designationDao instance ekak create karala me variable
    // ekata
    // inject karanawa.
    private WeekdayDao weekdayDao;

    @GetMapping(value = "/weekday/alldata", produces = "application/json")
    public List<Weekday> getAllData() {

        // me method eka /weekday/alldata kiyala url eken call karama
        // database eke thiyena okkoma Weekday data return karanawa JSON format ekata.

        return weekdayDao.findAll(); // DB eken okkoma records gannawa
    }
}
