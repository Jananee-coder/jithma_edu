package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.ModuleDao;
import lk.jithma_edu.entity.Module;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class ModuleController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka ModuleDao instance ekak create karala me variable ekata inject karanawa.

    private ModuleDao moduleDao;

    @GetMapping(value = "/module/alldata", produces = "application/json")
    public List<Module> getAllData() {

        // me method eka /module/alldata kiyala url eken call karama
        // database eke thiyena okkoma Module data return karanawa JSON format ekata.

        return moduleDao.findAll(); // DB eken okkoma records gannawa
    }
}
