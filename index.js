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

		let url = window.prompt('Please enter an image link:')
		p.loadImage(url, p.putImage, () => {
			alert('Load image failed, replace by default image...')
			p.loadImage('default_image.jpg', p.putImage)
		})
	}

	p.putImage = data => {
		img = data
		let aspect = data.width / data.height
		p.resizeCanvas(500 * aspect, 500)
		myShader.setUniform('resolution', [p.width * p.pixelDensity(), p.height * p.pixelDensity()])
	}

	p.draw = () => {
		if(!img) return
		let angle = p.atan2(p.height / 2 - p.mouseY, p.width / 2 - p.mouseX)
		let threshold = p.map(p.createVector(p.mouseX, p.mouseY)
												.dist(p.createVector(p.width / 2, p.height / 2)), 0, p.width / 1.2, 1, 0)
		myShader.setUniform('mainTex', img)
		myShader.setUniform('threshold', threshold)
		myShader.setUniform('angle', angle)
		myShader.setUniform('inverse', inverse)
		p.rect(-p.width / 2, -p.height / 2, p.width, p.height)
		p.noLoop()
	}

	 p.mouseClicked = () => {
		inverse = !inverse
		pause = false
		p.loop()
	}

	p.mouseMoved = () => {
		if(pause) return
		p.loop()
	}

	p.keyPressed = () => {
		pause = !pause
	}
}

new p5(pixel_sorting, 'effect')