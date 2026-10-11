package lk.jithma_edu.controller;

import java.util.List;

public interface CommonController<T> {

    // me method eka okkoma data ganna
    // ex: student list, teacher list etc.
    public List<T> getAllData();

    // me method eka data ekak save karanna
    // T kiyanne generic type ekak (Student, Teacher etc.)
    // t kiyanne save karanna object eka
    public String saveData(T t);

    // me method eka data ekak update karanna
    public String updateData(T t);

    // me method eka data ekak delete karanna
    public String deleteData(T t);
}
