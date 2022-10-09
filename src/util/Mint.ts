import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import * as ipfsClient from "ipfs-http-client";
import { TOKEN_METADATA_PROGRAM_ID } from "../data/Constants";
import axios from "axios";
import React, { useState } from "react";
import {encode, decode} from 'uint8-to-base64';
import { Readable } from 'react-read';
const FormData = require("form-data");

var btoa = require('btoa');

const projectId = '2DUage5uCFH7SHt8byaiqLxHLWL';   // <---------- your Infura Project ID
// const fs = require('fs').promises;

const projectSecret = '30394572d2a1c7802c851ab75ddb0c0d';  // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');



const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
},
});
const formData = new FormData();

// formData.append("file", fileImg);


const getWalletConnection = (
  program: Program
): [WalletContextState, anchor.web3.Connection] => {
  const wallet = (program.provider as anchor.AnchorProvider)
    .wallet as WalletContextState;
  const connection = program.provider.connection;
  return [wallet, connection];
};

const getMetadata = async (
  mintKey: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

export const uploadImageToIpfs = async ( imageFileBuffer) => {

  console.log(imageFileBuffer)
// const img=JSON.stringify(imageFileBuffer);
  const data = new FormData();
  //Usage example:
  // const uploadedImage = await ipfs.add(imageFileBuffer);
  data.append("file",imageFileBuffer);
    console.log("imageFileBuffer",imageFileBuffer);
let uploadedImage;
  // console.log(uploadedImage,"jjjjjjjj")
  try{
    uploadedImage = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      headers: {
        pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
        pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
        "Content-Type": `multipart/form-data; boundary= ${imageFileBuffer._boundary}`,
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiZDE4Zjc3NS0xOWQ2LTQyY2MtODBjNi0wNjc0MGVhODE3YTUiLCJlbWFpbCI6ImFqaXRoamVybWE0MkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMzM3ZTI4Njc5MzgwZWQ4Nzc0OTAiLCJzY29wZWRLZXlTZWNyZXQiOiIxOTJhMzk3ODkzM2UwMGE4OTdhN2NjNzJmZTI3MGQ0OWMxMjk3YmEyMzUzNzliYWRjZjhlZWQyNGIzZTIxN2MyIiwiaWF0IjoxNjY0ODgwMDIyfQ.brDnNSkspV6OuBaZbOD22ftup3jYYmixDdUoJKqq0OA`,
      },
    
    });
            
    }catch(e){
      console.log(e);
    }
  return `https://gateway.pinata.cloud/ipfs/${uploadedImage.data.IpfsHash}`;
};


export const uploadMetadataToIpfs = async (
  name: String,
  symbol: String,
  description: String,
  uploadedImage: String,
  traitSize: String,
  traitLiveIn: String,
  traitFood: String,
  
) => {
  const metadata = {
    name,
    symbol,
    description,
    image: uploadedImage,
    attributes: [
      {
        trait_type: "size",
        value: traitSize,
      },
      {
        trait_type: "live in",
        value: traitLiveIn,
      },
      {
        trait_type: "food",
        value: traitFood,
      },
    ],
    collection:
      {
        name:"chetu",
        family:"chetu"

      },
      
    
  };

  // const uploadedMetadata = await ipfs.add(JSON.stringify(metadata));
  let resFile;
  console.log("uploadedImage",metadata)
  try{
     resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data:metadata,
      headers: {
        pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
        pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiZDE4Zjc3NS0xOWQ2LTQyY2MtODBjNi0wNjc0MGVhODE3YTUiLCJlbWFpbCI6ImFqaXRoamVybWE0MkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMzM3ZTI4Njc5MzgwZWQ4Nzc0OTAiLCJzY29wZWRLZXlTZWNyZXQiOiIxOTJhMzk3ODkzM2UwMGE4OTdhN2NjNzJmZTI3MGQ0OWMxMjk3YmEyMzUzNzliYWRjZjhlZWQyNGIzZTIxN2MyIiwiaWF0IjoxNjY0ODgwMDIyfQ.brDnNSkspV6OuBaZbOD22ftup3jYYmixDdUoJKqq0OA`,
      },
    
    });
            
    console.log("resFile",resFile.data );
    }catch(e){
      console.log(e);
    }
  if (resFile.data == null) {
    return null;
  } else {
    return `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
  }
};

export const mint = async (
  program: Program,
  name: String,
  symbol: String,
  metadataUrl: String
) => {
  const [wallet, connection] = getWalletConnection(program);

  const lamports = await connection.getMinimumBalanceForRentExemption(
    MINT_SIZE
  );

  const mintKey = anchor.web3.Keypair.generate();

  const associatedTokenAddress = await getAssociatedTokenAddress(
    mintKey.publicKey,
    wallet.publicKey
  );
  console.log("NFT Account: ", associatedTokenAddress.toBase58());

  const mint_tx = new anchor.web3.Transaction().add(
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintKey.publicKey,
      space: MINT_SIZE,
      programId: TOKEN_PROGRAM_ID,
      lamports,
    }),
    createInitializeMintInstruction(
      mintKey.publicKey,
      0,
      wallet.publicKey,
      wallet.publicKey
    ),
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      associatedTokenAddress,
      wallet.publicKey,
      mintKey.publicKey
    )
  );
  let blockhashObj = await connection.getLatestBlockhash();
  console.log("blockhashObj", blockhashObj);
  mint_tx.recentBlockhash = blockhashObj.blockhash;

  try {
    const signature = await wallet.sendTransaction(mint_tx, connection, {
      signers: [mintKey],
    });
    await connection.confirmTransaction(signature, "confirmed");
  } catch {
    return null;
  }

  console.log("Mint key: ", mintKey.publicKey.toString());
  console.log("User: ", wallet.publicKey.toString());

  const metadataAddress = await getMetadata(mintKey.publicKey);
  console.log("Metadata address: ", metadataAddress.toBase58());

  try {
    const tx = program.transaction.mintNft(
      mintKey.publicKey,
      name,
      symbol,
      metadataUrl,
      {
        accounts: {
          mintAuthority: wallet.publicKey,
          mint: mintKey.publicKey,
          tokenAccount: associatedTokenAddress,
          tokenProgram: TOKEN_PROGRAM_ID,
          metadata: metadataAddress,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          payer: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
      }
    );

    const signature = await wallet.sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, "confirmed");
    console.log("Mint Success!");

    return {
      mintKey: mintKey.publicKey,
      associatedTokenAddress,
      metadataAddress,
    };
  } catch {
    return null;
  }
};
