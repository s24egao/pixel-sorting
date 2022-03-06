const pixel_sorting = p => {
	let img

	let myShader

	let inverse = false
	let pause = false

	p.setup = () => {
		p.createCanvas(500, 500, p.WEBGL)
		p.pixelDensity(2)
		p.frameRate(30)
		myShader = p.createShader(vert, frag)
		p.shader(myShader)

		let url = window.prompt('請輸入影像連結：')
		p.loadImage(url, p.putImage, () => {
			alert('載入影像失敗，使用預設圖片⋯⋯')
			p.loadImage('default_image.jpg', p.putImage)
		})
	}

	p.putImage = data => {
		img = data
		if(p.windowWidth > 600) p.resizeCanvas(500 * data.width / data.height, 500)
		else p.resizeCanvas(350, 350 * data.height / data.width)
		myShader.setUniform('resolution', [p.width * p.pixelDensity(), p.height * p.pixelDensity()])
		p.pixelSort()
	}

	p.draw = () => {
		if(!img) return
		if(p.movedX == 0 && p.movedY == 0 && !pause) return
		p.pixelSort()
	}

	p.pixelSort = () => {
		let angle = p.atan2(p.height / 2 - p.mouseY, p.width / 2 - p.mouseX)
		let threshold = p.map(p.createVector(p.mouseX, p.mouseY).dist(p.createVector(p.width / 2, p.height / 2)), 0, p.width / 1.2, 1, 0)
		myShader.setUniform('mainTex', img)
		myShader.setUniform('threshold', threshold)
		myShader.setUniform('angle', angle)
		myShader.setUniform('inverse', inverse)
		p.rect(-p.width / 2, -p.height / 2, p.width, p.height)
	}

	p.mousePressed = () => {
		inverse = !inverse
		pause = false
		p.loop()
	}

	p.keyPressed = () => {
		pause = !pause
	}
}

new p5(pixel_sorting, 'effect')