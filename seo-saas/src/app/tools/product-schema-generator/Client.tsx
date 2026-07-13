'use client';
import SchemaBuilder from '../_components/SchemaBuilder';
import { productConfig } from '../_components/schemaConfigs';

export default function Client() {
  return <SchemaBuilder config={productConfig} />;
}
