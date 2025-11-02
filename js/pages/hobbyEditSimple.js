// 极简兴趣爱好编辑页面脚本
document.addEventListener('DOMContentLoaded', function() {
  console.log('编辑页面DOM加载完成');
  
  // 表单提交处理
  const hobbyForm = document.getElementById('hobby-form');
  if (hobbyForm) {
    hobbyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('表单提交已阻止');
      // 简单的表单验证提示
      alert('兴趣爱好已保存！(模拟)');
    });
  }
  
  // 返回按钮功能
  const backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.location.href = 'hobbies.html';
    });
  }
  
  console.log('编辑页面初始化完成');
});