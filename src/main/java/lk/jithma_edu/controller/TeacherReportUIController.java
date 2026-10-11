package lk.jithma_edu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class TeacherReportUIController {

    // get user instance
    @Autowired
    private UserDao userDao;


    // meka /teacherpaymentreport kiyala url ekt giyama
    // Teacher Payment Report page eka load wenawa
    @RequestMapping("/teacherpaymentreport")
    public ModelAndView teacherPaymentReportPage() {

        // currently login wela inna user ge details gannawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // ModelAndView object ekak create karanawa
        ModelAndView teacherPaymentReportUI = new ModelAndView();

        // load wena html page eka set karanawa
        teacherPaymentReportUI.setViewName("reportteacherpayment.html");

        // login una user ge username eka page ekata yawanawa
        teacherPaymentReportUI.addObject("loggedusername", authentication.getName());

        // page title eka set karanawa
        teacherPaymentReportUI.addObject(
                "title", "Jithma Institute | Teacher Payment Report");

        teacherPaymentReportUI.addObject("userphoto", loggedUser.getUserphoto());

        // final page eka browser ekata return karanawa
        return teacherPaymentReportUI;
    }
}
