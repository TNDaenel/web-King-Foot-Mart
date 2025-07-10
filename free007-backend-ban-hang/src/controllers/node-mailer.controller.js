import * as dotenv from 'dotenv';

import nodemailer from 'nodemailer';

const { SECRET_CODE, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;
dotenv.config();
export const sendEmailOrder = async (data) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: EMAIL_USERNAME,
			pass: EMAIL_PASSWORD,
		},
	});

	const info = await transporter.sendMail({
		from: '"Hey 🙋🏻‍♂️" <admin@gmail.com>',
		subject: data.subject,
		text: data.text,
		html: data.html
			? data.html
			: `
  <div class="col-md-12">
    <div class="row">
      <div class="receipt-main col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3">

        <div class="row">
          <div class="receipt-header receipt-header-mid">
            <div class="col-xs-8 col-sm-8 col-md-8 text-left">
              <div class="receipt-right">
                <h3><b>Dear ${data?.fullname} </b></h3>


                <p><b>Thời gian :</b> ${data.createdAt}</p>
                <p><b>Hình thức thanh toán:</b> ${data.payment}</p>
                <p><b>Id đơn hàng:</b> ${data.orderId}</p>
                <p><b>Trạng thái đơn hàng:</b> ${data.statusOrder}</p>
              </div>

            </div>
            <div class="col-xs-4 col-sm-4 col-md-4">
              <div class="receipt-left">
                <h3>HÓA ĐƠN ĐẶT HÀNG</h3>
              </div>
            </div>
          </div>
        </div>


        <div class="row">
          <div class="receipt-header receipt-header-mid receipt-footer">
            <div class="col-xs-8 col-sm-8 col-md-8 text-left">
              <div class="receipt-right">

                <h4 style="color: rgb(140, 140, 140);">Cảm ơn bạn rất nhiều 💕💕💕!</h4>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>

  `,
		to: data.to,
	});
};
