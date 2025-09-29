//package com.swp391.dichvuchuyennha.controller;
//
//import com.swp391.dichvuchuyennha.dto.request.WorkProgressRequest;
//import com.swp391.dichvuchuyennha.dto.response.WorkProgressResponse;
//import com.swp391.dichvuchuyennha.service.WorkProgressService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/work-progress")
//@RequiredArgsConstructor
//public class WorkProgressController {
//
//    private final WorkProgressService workProgressService;
//
//    // ✅ Lấy toàn bộ tiến độ
//    @GetMapping
//    public ResponseEntity<List<WorkProgressResponse>> getAll() {
//        return ResponseEntity.ok(workProgressService.getAllWorkProgress());
//    }
//
//    // ✅ Lấy tiến độ theo ID
//    @GetMapping("/{id}")
//    public ResponseEntity<WorkProgressResponse> getById(@PathVariable Integer id) {
//        return ResponseEntity.ok(workProgressService.getWorkProgressById(id));
//    }
//
//    // ✅ Tạo mới tiến độ
//    @PostMapping
//    public ResponseEntity<WorkProgressResponse> create(@RequestBody WorkProgressRequest request) {
//        return ResponseEntity.ok(workProgressService.createWorkProgress(request));
//    }
//
//    // ✅ Cập nhật tiến độ
//    @PutMapping("/{id}")
//    public ResponseEntity<WorkProgressResponse> update(@PathVariable Integer id,
//                                                       @RequestBody WorkProgressRequest request) {
//        return ResponseEntity.ok(workProgressService.updateWorkProgress(id, request));
//    }
//
//    // ✅ Xóa tiến độ
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable Integer id) {
//        workProgressService.deleteWorkProgress(id);
//        return ResponseEntity.noContent().build();
//    }
//}
