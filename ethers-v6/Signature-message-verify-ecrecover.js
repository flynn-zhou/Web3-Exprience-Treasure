const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Signature", function () {
  async function loadSignatureFixture() {
    const [signer] = await ethers.getSigners();

    const Signature = await ethers.getContractFactory("Signature");

    const signature = await Signature.deploy();

    console.log("signature:", signature);

    // await signature.deployed();

    console.log("Signature deployed at:", signature.target);

    return { signature, signer };
  }

  it("verify signature message", async function () {
    const { signature, signer } = await loadFixture(loadSignatureFixture);
    console.log("signer:", signer);

    const message = "my message string!";
    const messageHash = await ethers.solidityPackedKeccak256(
      ["string"],
      [message]
    );
    const messageHashBytes = ethers.getBytes(messageHash);
    // const messageHashBytes = ethers.utils.hexlify(messageHash);

    // signature.verify(signer, )
    const sig = await signer.signMessage(messageHashBytes);

    const sigVRS = ethers.Signature.from(sig);

    console.log("sig-v:", sigVRS.v);
    console.log("sig-r:", sigVRS.r);
    console.log("sig-s:", sigVRS.s);
    expect(
      await signature.verify(
        signer.address,
        message,
        sigVRS.v,
        sigVRS.r,
        sigVRS.s
      )
    ).to.be.equals(true);
  });
});
