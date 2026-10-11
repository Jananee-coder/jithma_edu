package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.SubjectDetailDao;
import lk.jithma_edu.entity.SubjectDetail;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class SubjectDetailController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka subjectDetailDao instance ekak create karala me
    // variable ekata
    // inject karanawa.
    private SubjectDetailDao subjectDetailDao;

    @GetMapping(value = "/subjectdetail/alldata", produces = "application/json")
    public List<SubjectDetail> getAllData() {

        // me method eka /subjectdetail/alldata kiyala url eken call karama
        // database eke thiyena okkoma SubjectDetail data return karanawa JSON
        // format ekata.

        return subjectDetailDao.findAll(); // DB eken okkoma records gannawa
    }

    // define api for insert subjectdetail
    @PostMapping(value = "/subjectdetail/insert")
    public String insert(@RequestBody SubjectDetail subjectdetail) {
        // frontend eken JSON widiyata ena subjectdetail object eka RequestBody haraha
        // laba gannawa

        try {
            // subjectdetail object eka database ekata save karanawa
            subjectDetailDao.save(subjectdetail);
            // save success nam "OK" kiyala return karanawa
            return "OK";
        } catch (Exception e) {
            // save karana awasthawedi error ekak awoth error message eka return karanawa
            return e.getMessage();
        }
    }

    // grade ekata adala subjects okkoma gannawa
    @GetMapping("/subjectdetail/bygrade/{gradeId}")
    public List<SubjectDetail> getSubjectsByGrade(@PathVariable Integer gradeId) {
        return subjectDetailDao.getByGrade(gradeId);
    }
}
