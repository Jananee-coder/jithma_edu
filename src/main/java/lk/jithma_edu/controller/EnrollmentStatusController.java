package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.EnrollmentStatusDao;
import lk.jithma_edu.entity.EnrollmentStatus;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
public class EnrollmentStatusController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka enrollmentStatusDao instance ekak create karala me
    // variable ekata
    // inject karanawa.
    private EnrollmentStatusDao enrollmentStatusDao;

    @GetMapping(value = "/enrollmentstatus/alldata", produces = "application/json")
    public List<EnrollmentStatus> getAllData() {

        // me method eka /enrollmentstatus/alldata kiyala url eken call karama
        // database eke thiyena okkoma EnrollmentStatus data return karanawa JSON format
        // ekata.

        return enrollmentStatusDao.findAll(); // DB eken okkoma records gannawa
    }
}
