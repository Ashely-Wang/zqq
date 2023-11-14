const express = require('express');
const fileUpload = require('express-fileupload');
const mysql = require('mysql');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
// 使用中间件配置文件上传
// app.use(fileUpload());
app.use(cors());
// 设置静态文件夹
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
// 设置multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 指定文件存储的目录
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    // 指定文件的名称
    cb(null,  file.fieldname+'-'+Date.now()+file.originalname)
  }
});
const upload = multer({ storage: storage });



// 设置路由处理上传请求
app.post('/api/upload', (req, res) => {
  // 检查是否有文件上传
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: '没有上传文件' });
  }

  // 获取上传的文件
  const imageFile = req.files.image;

  // 移动文件到指定路径
  imageFile.mv(path.join(__dirname, 'uploads', imageFile.name), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '文件上传失败' });
    }

    // 文件上传成功
    res.json({ message: '文件上传成功' });
  });
});

// 连接MySQL数据库
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zqq123456*',
  database: 'zqq'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// 创建API路由

// 获取所有数据
app.get('/', (req, res) => {
  const query = 'SELECT * FROM blog';
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// 添加数据
// app.post('/add', (req, res) => {
//   const { name, email } = req.body; // 假设请求体包含name和email字段
//   const query = `INSERT INTO blog (title, content, imageList) VALUES ('${title}', '${content}', '${imageList}')`;
//   connection.query(query, (error, results) => {
//     if (error) throw error;
//     res.send('Data added successfully!');
//   });
// });

// 使用multer处理文件上传
app.post('/xxx', upload.array('pictures', 18), function(req, res) {
  console.log(req.files);
  
  // console.log(req);
	// console.log(req.file)
	//文件获取成功
	console.log(req.body)
	//此时打印出的请求体req.body为[Object:null propotype] {userInfor: [object Object]}
	//因此为了得到最终数据需进行进一步处理
	//对于[Object:null propotype]为了得到后面的数据可以对请求体进行JSON.stringfy()转换，再通过JSON.parse()转换为可读的JS对象 即：
	const ret = JSON.parse(JSON.stringify(req.body))
	console.log(ret.textContent)
	// //此时打印出的仍然不是最终数据，因为前端传过来的是经JSON.stringfy()处理后的字符串而非对象，因此再调用一次JSON.parse()方法将其转换为真正的可读JS对象
	const finalResult = JSON.parse(ret.textContent)
	console.log(finalResult)
  let title = ret.title ? ret.title : "";
  let content = finalResult;
  let imageFiled = {};
  for (let i = 0; i < req.files.length; i++) {
    imageFiled[i] = req.files[i].filename;
  }
  const query = `INSERT INTO blog (title, content, imageList) VALUES ('${title}', '${JSON.stringify(content)}', '${JSON.stringify(imageFiled)}')`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.send('Data added successfully!');
  });
	//普通数据获取成功
})

//查询数据
app.get('/get', (req, res) => {
  const query = `SELECT * from blog`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    results.map(val => {
      val.content = JSON.parse(val.content);
      val.imageList = JSON.parse(val.imageList);
    })
    res.json({
      code: 200,
      msg: "",
      data: results
    })
  });
});

// 更新数据
app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body; // 假设请求体包含name和email字段
  const query = `UPDATE your_table SET name = '${name}', email = '${email}' WHERE id = ${id}`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.send('Data updated successfully!');
  });
});

// 删除数据
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM your_table WHERE id = ${id}`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.send('Data deleted successfully!');
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});