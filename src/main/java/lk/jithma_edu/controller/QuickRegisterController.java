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
public class QuickRegisterController {

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /quickregister kiyala url ekt giyama quickregister page eka load wenawa
    @RequestMapping("/quickregister")
    public ModelAndView quickregisterUIPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView quickregisterUI = new ModelAndView();

        // view name eka set karanawa (quickregister.html file eka)
        quickregisterUI.setViewName("quickregister.html");

        // login una user ge nama privilege ekata pass karanawa
        quickregisterUI.addObject("loggedusername", authentication.getName());

        // title set
        quickregisterUI.addObject("title", "Jithma Institute | Quick Register Management");

        // photo set
        quickregisterUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return quickregisterUI;
    }

}
