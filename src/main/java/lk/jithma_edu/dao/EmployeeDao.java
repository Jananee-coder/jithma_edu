package lk.jithma_edu.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Employee;

//JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
//JpaRepository<E, I> --->  entity + primary key type set karanawa
public interface EmployeeDao extends JpaRepository<Employee, Integer> {

    // Query
    // 1.native => using databasename table anme
    // 2.JPQL (default active)=> using Entity class name ---Java Persistence Query
    // Language

    // Native query example
    // nativeQuery = true kiyanne JPA kiyanne me query eka **direct SQL query** ekak
    // wage run karanna
    // database table name saha column names use karanna puluwan
    // getNextNumber() → employee table eke max(empno) balala next emp number

    // max(e.empno)
    // employee table eke thiyena highest empno eka gannawa Example -> EMP00015
    // substring(max(e.empno),4)
    // "EMP" prefix eka remove karala number part eka gannawa  EMP00015 -> 00015
    // +1
    // number eka next value ekata increase karanawa  00015 -> 16
    // lpad(...,5,'0')
    // number eka digits 5k wenna zero walin pad karanawa  16 -> 00016
    // concat('EMP', ...)
    // new number ekata "EMP" prefix eka add karanawa 00016 -> EMP00016
    // coalesce(...,'EMP00001')
    // table eka empty nam max value null wenawa
    // e welawata default employee number eka widiyata EMP00001 return karanawa
 
   //Test DB 

    //  @Query(value = "SELECT coalesce(concat('EMP',lpad(substring(max(e.empno),4)+1,5,'0')),'EMP00001')  FROM jithma_edu.employee as e;", nativeQuery = true)


    //Clean DB
    @Query(value = "SELECT coalesce(concat('EMP',lpad(substring(max(e.empno),4)+1,5,'0')),'EMP00001')  FROM jithma_edu_clean.employee as e;", nativeQuery = true)

    public String getNextNumber();

    // JPQL use(entity related) karanne entity class name (Employee) saha Java fields names
    // Database table name naththam
    // create query for get employee by given mobile no
    @Query(value = "select e from Employee e where e.mobileno=?1")
    public Employee getByMobileNo(String mobileno);

    // create query for get employee by given nic
    @Query(value = "select e from Employee e where e.nic=?1")
    public Employee getByNic(String nic);

    // create query for get employee by given mobile no
    @Query(value = "select e from Employee e where e.email=?1")
    public Employee getByEmail(String email);

    // create query for get Employee List Without User Account
    @Query("select e from Employee e where e.id not in (select u.employee_id.id from User u where u.employee_id is not null)")
    List<Employee> getemployeeListWithoutUserAccount();

}
